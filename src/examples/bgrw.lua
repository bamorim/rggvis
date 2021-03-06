-- Probability of adding a vertex to the current position at every step
p = 0.5

-- Add the first vertex with self loop
local pos = addVertex()
connectVertices(pos, pos)
setAttributes(pos, "color", "red")

-- Give a chance to render
render()

-- Main Loop
while true do
  -- Take a random walk step
  setAttributes(pos, "color", "white")
  pos = getRandomNeighbor(pos)
  setAttributes(pos, "color", "red")

  -- Give a chance to render
  render()

  -- Add a new vertex connected to the current position with probability p
  if math.random() < p then
    connectVertices(pos, addVertex())
  end

  -- Give a chance to render
  render()
end